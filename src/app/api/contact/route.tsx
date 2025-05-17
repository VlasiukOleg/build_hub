import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import configuration from '@/utils/configuration';

interface Material {
  title: string;
  quantity: number;
  price: number;
  salePrice: number;
}

export async function POST(request: Request) {
  try {
    const {
      firstName,
      phone,
      email,
      address,
      message,
      date,
      materials,
      deliveryTime,
      totalPrice,
      totalWeight,
      deliveryPrice,
      deliveryType,
      deliveryStorage,
      movingPrice,
      isMovingAddToOrder,
      additionalMaterial,
      configurableMaterialList,
    } = await request.json();

    const formattedDate = format(new Date(date), "d MMMM yyyy 'року'", {
      locale: uk,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: configuration.apiMailUser,
        pass: configuration.apiMailPass,
      },
    });

    const materialsTable = `
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="border: 1px solid black; padding: 8px;">№</th>
        <th style="border: 1px solid black; padding: 8px;">Назва</th>
        <th style="border: 1px solid black; padding: 8px;">К-сть</th>
        <th style="border: 1px solid black; padding: 8px;">Ціна за одиницю</th>
        <th style="border: 1px solid black; padding: 8px;">Загальна ціна</th>
      </tr>
    </thead>
    <tbody>
      ${[...materials, ...configurableMaterialList]
        .map(
          (material: Material, index: number) => `
        <tr>
        <td style="border: 1px solid black; padding: 8px;">${index + 1}</td>
          <td style="border: 1px solid black; padding: 8px;">${material.title}</td>
          <td style="border: 1px solid black; padding: 8px;">${material.quantity}</td>
          <td style="border: 1px solid black; padding: 8px;">${material.salePrice > 0 ? material.salePrice : material.price} грн.</td>
          <td style="border: 1px solid black; padding: 8px;">${(material.quantity * (material.salePrice > 0 ? material.salePrice : material.price)).toFixed(2)} грн.</td>
        </tr>
      `
        )
        .join('')}
      
      ${
        isMovingAddToOrder
          ? `
        <tr>
          <td style="border: 1px solid black; padding: 8px;">${materials.length + 1}</td>
          <td style="border: 1px solid black; padding: 8px;">Розвантаження</td>
          <td style="border: 1px solid black; padding: 8px;">1</td>
          <td style="border: 1px solid black; padding: 8px;">${movingPrice} грн.</td>
          <td style="border: 1px solid black; padding: 8px;">${movingPrice} грн.</td>
        </tr>`
          : ''
      }
        
      ${
        deliveryType === 'delivery'
          ? `
        <tr>
          <td style="border: 1px solid black; padding: 8px;">${materials.length + 2}</td>
          <td style="border: 1px solid black; padding: 8px;">Доставка</td>
          <td style="border: 1px solid black; padding: 8px;">1</td>
          <td style="border: 1px solid black; padding: 8px;">${deliveryPrice} грн.</td>
          <td style="border: 1px solid black; padding: 8px;">${deliveryPrice} грн. </td>
        </tr>`
          : ''
      }
    </tbody>
  </table>
  <table style="width: 100%; margin-top: 16px;">
    <tr>
      <td style="font-weight: bold;">Вага: ${totalWeight} кг.</td>
      <td style="text-align: right; font-weight: bold;">Всього до оплати: ${((isMovingAddToOrder ? movingPrice : 0) + (deliveryType === 'pickup' ? 0 : deliveryPrice) + totalPrice).toFixed(2)} грн.</td>
    </tr>
  </table>
  
`;

    const additionalMaterialTable = `
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="border: 1px solid black; padding: 8px;">Назва</th>
        <th style="border: 1px solid black; padding: 8px;">К-сть</th>
        <th style="border: 1px solid black; padding: 8px;">Ціна за одиницю</th>
        
      </tr>
    </thead>
    <tbody>
      ${additionalMaterial
        .map(
          (material: Material) => `
        <tr>
          <td style="border: 1px solid black; padding: 8px;">${material.title}</td>
          <td style="border: 1px solid black; padding: 8px;">${material.quantity}</td>
          <td style="border: 1px solid black; padding: 8px;">${material.price}</td>
        </tr>
      `
        )
        .join('')}
      
     
        
      
    </tbody>
  </table>
  
  
`;

    const mailOptions = {
      from: configuration.apiMailFrom,
      to: `${configuration.apiMailTo}, user_oleksandr0709@ukr.net`,
      subject: 'Нова заявка з сайту LUM',
      html: `
        <p>Імʼя: ${firstName}</p>
        <p>Телефон: ${phone}</p>
        <p>Email: ${email}</p>
        <p>Адреса: ${address}</p>
        <p>Дата та час: ${formattedDate} ${deliveryTime ? deliveryTime : 'Не вибрано час доставки'}</p>
        <p>Коментар: ${message}</p>
        ${materialsTable}
        <p style="font-weight: bold;">Додані матеріали</p>
        ${additionalMaterialTable}
        
        <p>Склад: ${deliveryStorage ? deliveryStorage : 'Не вибрано'}</p>
        <p>Тип доставки: ${
          deliveryType
            ? deliveryType === 'delivery'
              ? 'Доставка автотранспотром'
              : 'Самовивіз зі складу'
            : 'Не вибрано'
        }</p>
      `,
    };

    const mailOptionsToClient = {
      from: configuration.apiMailFrom,
      to: email,
      subject: 'Підтвердження замовлення з сайту LUM',
      html: `
        <p>Дякуємо за Ваше замовлення, ${firstName}!</p>
        <p>Ось деталі Вашого замовлення:</p>
        <p>Імʼя: ${firstName}</p>
        <p>Телефон: ${phone}</p>
        <p>Email: ${email}</p>
        <p>Адреса: ${address}</p>
        <p>Дата та час: ${formattedDate} ${deliveryTime}</p>
        <p>Коментар: ${message}</p>
        ${materialsTable}
         <p style="font-weight: bold;">Додані матеріали</p>
        ${additionalMaterialTable}
        
        <p>Склад: ${deliveryStorage ? deliveryStorage : 'Не вибрано'}</p>
        <p>Тип доставки: ${
          deliveryType
            ? deliveryType === 'delivery'
              ? 'Доставка автотранспотром'
              : 'Самовивіз зі складу'
            : 'Не вибрано'
        }</p>
        
      `,
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptionsToClient);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse('Failed to send message.', { status: 500 });
  }
}
