'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { uk } from 'date-fns/locale';
import { isToday, getHours, getMinutes, getDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import sendingEmail from '@/utils/sendEmail';

import DatePicker from 'react-datepicker';
import { Input, Textarea, Select, SelectItem } from '@heroui/react';

import { Field, Label } from '@headlessui/react';

import { CiCalendar } from 'react-icons/ci';
import styles from './orderform.module.css';

const phoneRegex = /^(0\d{9})$/;

const orderValidationSchema = yup.object({
  firstName: yup.string().required("Це поле є обов'язковим до заповнення"),
  email: yup
    .string()
    .required(
      "Це поле є обов'язковим до заповнення, на цю пошту прийде Ваше замовлення"
    )
    .email('Не правильний email'),
  phone: yup
    .string()
    .matches(phoneRegex, 'Формат 0681118888')
    .required("Це поле є обов'язковим до заповнення"),
  address: yup.string().required("Це поле є обов'язковим до заповнення"),
  message: yup.string().nullable(),
  date: yup.date().required("Це поле є обов'язковим до заповнення"),
});

const timesList = [
  {
    key: '11.00 - 12.00',
    label: '11.00 - 12.00',
  },
  {
    key: '14.00 - 15.00',
    label: '14.00 - 15.00',
  },
  {
    key: '17.00 - 18.00',
    label: '17.00 - 18.00',
  },
];

export interface IFormState {
  firstName: string;
  email: string;
  phone: string;
  address: string;
  message?: string | null;
  date: Date;
}

interface IOrderFormProps {}

const OrderForm: React.FC<IOrderFormProps> = ({}) => {
  const categories = useAppSelector(state => state.categories);
  const additionalMaterial = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
  );
  const deliveryPrice = useAppSelector(state => state.delivery.deliveryPrice);
  const deliveryType = useAppSelector(state => state.delivery.deliveryType);
  const movingPrice = useAppSelector(state => state.moving.movingPrice);
  const deliveryStorage = useAppSelector(
    state => state.delivery.deliveryStorage
  );
  const isMovingAddToOrder = useAppSelector(
    state => state.moving.isMovingPriceAddToOrder
  );
  const isAdditionalMaterialAddToOrder = useAppSelector(
    state => state.additionalMaterial.isAdditionalMaterialAddToOrder
  );

  const allMaterialsCategories = categories.flatMap(
    material => material.categories
  );

  const materials = allMaterialsCategories.flatMap(
    category => category.materials
  );

  const filteredMaterialsByQuantity = materials.filter(
    material => material.quantity > 0
  );

  const totalPrice = materials.reduce((acc, value) => {
    return acc + value.price * value.quantity;
  }, 0);

  const totalWeight = materials.reduce((acc, value) => {
    return acc + value.weight * value.quantity;
  }, 0);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IFormState>({
    resolver: yupResolver(orderValidationSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const selectedDate = watch('date');

  const [sendError, setSendError] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState<any>(new Set([]));
  const [disabledTimeKeys, setDisabledTimeKeys] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDate.getDay() === 0) {
      setDisabledTimeKeys(['11.00 - 12.00', '14.00 - 15.00', '17.00 - 18.00']);

      return;
    }

    if (isToday(selectedDate)) {
      const now = new Date();
      const currentHour = getHours(now);
      const currentMinute = getMinutes(now);
      const currentDay = getDay(now);

      if (currentDay === 6) {
        const disabledKeys = ['17.00 - 18.00'];
        if (currentHour > 9 || (currentHour === 9 && currentMinute >= 30)) {
          disabledKeys.push('11.00 - 12.00');
        }
        if (currentHour > 13 || (currentHour === 13 && currentMinute >= 30)) {
          disabledKeys.push('14.00 - 15.00');
        }
        setDisabledTimeKeys(disabledKeys);
        return;
      }

      if (currentHour > 13 || (currentHour === 13 && currentMinute >= 30)) {
        setDisabledTimeKeys(['11.00 - 12.00', '14.00 - 15.00']);
      } else if (
        currentHour > 9 ||
        (currentHour === 9 && currentMinute >= 30)
      ) {
        setDisabledTimeKeys(['11.00 - 12.00']);
      } else if (
        currentHour > 15 ||
        (currentHour === 15 && currentMinute >= 30)
      ) {
        setDisabledTimeKeys([
          '11.00 - 12.00',
          '14.00 - 15.00',
          '17.00 - 18.00',
        ]);
      } else {
        setDisabledTimeKeys([]);
      }
    } else {
      if (getDay(selectedDate) === 6) {
        setDisabledTimeKeys(['17.00 - 18.00']);
      } else {
        setDisabledTimeKeys([]);
      }
    }
  }, [selectedDate]);

  const onSubmit = async (data: IFormState) => {
    setSendError(false);
    const sanitizedData = {
      ...data,
      firstName: data.firstName.trim(),
      phone: data.phone.replace(/[\s()-]/g, ''),
      email: data.email.trim(),
      address: data.address.trim(),
      message: data.message ? data.message.trim() : '',
      date: data.date,
      materials: filteredMaterialsByQuantity,
      deliveryTime: Array.from(deliveryTime)[0],
      totalPrice: totalPrice,
      totalWeight: totalWeight,
      deliveryPrice: deliveryPrice,
      deliveryType: deliveryType,
      movingPrice: movingPrice,
      deliveryStorage: deliveryStorage,
      isMovingAddToOrder: isMovingAddToOrder,
      additionalMaterial: additionalMaterial,
      isAdditionalMaterialAddToOrder: isAdditionalMaterialAddToOrder,
    };
    try {
      setIsSending(true);
      await sendingEmail(sanitizedData);
      reset();
      router.push('/thanks');
    } catch (error) {
      setSendError(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <form className="w-full xl:w-[48%] " onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-xl flex flex-col gap-4 bg-bgWhite border-[1px] border-grey p-4 md:space-y-4">
          <div className="relative">
            <Input
              {...register('firstName')}
              isClearable
              label="Ваше ім'я"
              placeholder="Введіть ім'я"
              size="md"
              labelPlacement="outside"
              variant="bordered"
              classNames={{
                label: 'text-xs font-semibold md:text-sm !text-grey',
                inputWrapper: 'group-data-[focus=true]:border-accent',
              }}
            />
            <p className="absolute left-0 bottom-[-20px] text-[10px]/6 text-red-600">
              {errors.firstName?.message}
            </p>
          </div>
          <div className="relative">
            <Input
              {...register('email')}
              isClearable
              label="Email"
              placeholder="Введіть email"
              size="md"
              labelPlacement="outside"
              variant="bordered"
              classNames={{
                label: 'text-xs font-semibold md:text-sm !text-grey',
                inputWrapper: 'group-data-[focus=true]:border-accent',
              }}
            />
            <p className="absolute left-0 bottom-[-20px] text-[10px]/6 text-red-600">
              {errors.email?.message}
            </p>
          </div>
          <div className="relative">
            <Input
              {...register('phone')}
              isClearable
              label="Телефон"
              placeholder="Введіть телефон"
              size="md"
              labelPlacement="outside"
              variant="bordered"
              classNames={{
                label: 'text-xs font-semibold md:text-sm !text-grey',
                inputWrapper: 'group-data-[focus=true]:border-accent',
              }}
            />
            <p className="absolute left-0 bottom-[-20px] text-[10px]/6 text-red-600">
              {errors.phone?.message}
            </p>
          </div>
          <div className="relative">
            <Input
              {...register('address')}
              isClearable
              label="Адреса"
              placeholder="Введіть адресу доставки"
              size="md"
              labelPlacement="outside"
              variant="bordered"
              classNames={{
                label: 'text-xs  font-semibold md:text-sm !text-grey',
                inputWrapper: 'group-data-[focus=true]:border-accent',
              }}
            />
            <p className="absolute  left-0 bottom-[-20px] text-[10px]/6 text-red-600">
              {errors.address?.message}
            </p>
          </div>
          <Textarea
            {...register('message')}
            label="Додаткова інформація"
            labelPlacement="outside"
            size="md"
            placeholder="Напишіть додаткову інформацію якщо потрібно"
            variant="bordered"
            classNames={{
              label: 'text-xs font-semibold md:text-sm !text-grey',
              inputWrapper: 'group-data-[focus=true]:border-accent',
            }}
          />
          <Field className="relative flex flex-col">
            <Label className="text-xs font-semibold text-grey md:text-sm">
              Дата та час доставки
            </Label>
            <div className="mt-2 flex flex-col  gap-2 md:flex-row">
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    showIcon
                    selected={field.value}
                    icon={<CiCalendar className="!size-[22px]" />}
                    onChange={field.onChange}
                    dateFormat="dd/MM/yyyy"
                    locale={uk}
                    minDate={new Date()}
                    popperClassName="!z-[11]"
                    filterDate={date => {
                      return date.getDay() !== 0;
                    }}
                    className={clsx(
                      styles.input,
                      'w-full md:w-[300px] block rounded-xl border-[2px] border-gray-200 hover:border-gray-400 focus:border-accent focus:outline-none bg-bgWhite h-10 px-5 !pl-8 text-sm text-grey md:text-sm md:py-2'
                    )}
                  />
                )}
              />
              <Select
                aria-label="Час доставки"
                renderValue={items => (
                  <div className="text-grey text-sm">
                    {items.map(item => item.textValue).join(', ')}
                  </div>
                )}
                items={timesList}
                placeholder="Виберіть час доставки"
                labelPlacement="outside"
                size="md"
                variant="bordered"
                selectedKeys={deliveryTime}
                onSelectionChange={setDeliveryTime}
                disabledKeys={disabledTimeKeys}
                classNames={{
                  trigger:
                    'data-[open=true]:border-accent data-[focus=true]:border-accent',
                }}
              >
                {time => <SelectItem key={time.key}>{time.label}</SelectItem>}
              </Select>
            </div>
          </Field>
        </div>

        <div className="text-center mt-4 flex justify-center">
          <Button
            type="submit"
            size="sm"
            className="bg-accent text-white font-medium text-base h-10 xl:text-lg xl:h-12"
            radius="sm"
            isLoading={isSending}
          >
            Оформити замовлення
          </Button>
        </div>
      </form>
    </>
  );
};

export default OrderForm;
