'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { uk } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { Button } from '@heroui/react';

import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import sendingEmail from '@/utils/sendEmail';

import CircleIcon from '/public/icons/circle.svg';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

import {
  Description,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Select,
  Textarea,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';

import clsx from 'clsx';

const phoneRegex = /^(0\d{9})$/;

const orderValidationSchema = yup.object({
  firstName: yup.string().required("Це поле є обов'язковим до заповнення"),
  email: yup
    .string()
    .required("Це поле є обов'язковим до заповнення")
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
  { id: 1, name: '11.00 - 12.00' },
  { id: 2, name: '14.00 - 15.00' },
  { id: 3, name: '17.00-18.00' },
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

  const [sendError, setSendError] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [deliveryTime, setDeliveryTime] = useState(timesList[0]);

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
      deliveryTime: deliveryTime,
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
      <form className="w-full xl:w-[48%]" onSubmit={handleSubmit(onSubmit)}>
        <Fieldset className="space-y-3 rounded-xl bg-bgWhite border-[1px] border-grey p-4 md:space-y-4">
          <Field className="relative">
            <Label className="text-xs/6 font-medium  text-grey md:text-sm">
              Ваше імя
            </Label>
            <Input
              {...register('firstName')}
              className={clsx(
                'mt-1 block w-full rounded-lg border-[1px] border-grey bg-bgWhite py-1.5 px-3 text-xs/6 text-grey md:text-sm md:py-2',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-accent'
              )}
            />

            <p className="absolute left-0 bottom-[-20px] text-[10px]/6 text-red-600">
              {errors.firstName?.message}
            </p>
          </Field>
          <Field className="relative">
            <Label className="text-xs/6 font-medium  text-grey md:text-sm">
              Email
            </Label>
            <Input
              {...register('email')}
              className={clsx(
                'mt-1 block w-full rounded-lg border-[1px] border-grey bg-bgWhite py-1.5 px-3 text-xs/6 text-grey md:text-sm md:py-2',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-accent'
              )}
            />
            <p className="absolute left-0 bottom-[-20px] text-[10px]/6 text-red-600">
              {errors.email?.message}
            </p>
          </Field>
          <Field className="relative">
            <Label className="text-xs/6 font-medium  text-grey md:text-sm">
              Телефон
            </Label>
            <Input
              {...register('phone')}
              className={clsx(
                'mt-1 block w-full rounded-lg border-[1px] border-grey bg-bgWhite py-1.5 px-3 text-xs/6 text-grey md:text-sm md:py-2',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-accent'
              )}
            />
            <p className="absolute left-0 bottom-[-20px] text-[10px]/6 text-red-600">
              {errors.phone?.message}
            </p>
          </Field>
          <Field className="relative">
            <Label className="text-xs/6 font-medium  text-grey md:text-sm">
              Адреса доставки
            </Label>
            <Input
              {...register('address')}
              className={clsx(
                'mt-1 block w-full rounded-lg border-[1px] border-grey bg-bgWhite py-1.5 px-3 text-xs/6 text-grey md:text-sm md:py-2',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-accent'
              )}
            />
            <p className="absolute left-0 bottom-[-20px] text-[10px]/6 text-red-600">
              {errors.address?.message}
            </p>
          </Field>
          <Field className="relative flex flex-col">
            <Label className="text-xs/6 font-medium text-grey md:text-sm">
              Дата та час доставки
            </Label>
            <div className="mt-1 flex flex-col gap-2 md:flex-row">
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="dd/MM/yyyy"
                    locale={uk}
                    className={clsx(
                      'w-full md:w-[300px] block  rounded-lg border-[1px] border-grey bg-bgWhite py-1.5 px-3 text-xs/6 text-grey md:text-sm md:py-2',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-accent'
                    )}
                  />
                )}
              />
              <Listbox value={deliveryTime} onChange={setDeliveryTime}>
                <ListboxButton
                  className={clsx(
                    'relative block w-full  rounded-lg bg-bgWhite border border-grey py-1.5 pr-8 pl-3 text-left text-xs/6 text-grey md:text-sm',
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-accent'
                  )}
                >
                  {deliveryTime.name}
                  <ChevronDownIcon
                    className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-grey"
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom"
                  transition
                  className={clsx(
                    'w-[var(--button-width)] rounded-xl border border-grey bg-bgWhite [--anchor-gap:var(--spacing-1)] focus:outline-none',
                    'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                  )}
                >
                  {timesList.map(time => (
                    <ListboxOption
                      key={time.name}
                      value={time}
                      className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                    >
                      <CheckIcon className="invisible size-4 fill-grey group-data-[selected]:visible" />
                      <div className="text-xs/6 md:text-sm text-grey">
                        {time.name}
                      </div>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            </div>
          </Field>

          <Field>
            <Label className="text-xs/6 font-medium text-grey md:text-sm">
              Додаткова інформація
            </Label>

            <Textarea
              {...register('message')}
              className={clsx(
                'mt-1 block w-full resize-none rounded-lg border-[1px] border-grey bg-bgWhite py-1.5 px-3 text-sm/6 text-grey md:text-sm md:py-2',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
              )}
              rows={3}
            />
          </Field>
        </Fieldset>
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
