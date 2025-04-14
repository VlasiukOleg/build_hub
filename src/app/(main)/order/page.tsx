import Script from 'next/script';

import OrderList from '@/components/common/OrderList';

interface IOrderPageProps {}

const OrderPage: React.FC<IOrderPageProps> = () => {
  return (
    <>
      <section className="py-5 md:py-10 w-full">
        <div className="container">
          <h1 className="text-center text-grey font-bold mb-2 md:text-lg md:mb-4 xl:text-2xl xl:mb-6">
            Оформити замовлення
          </h1>
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default OrderPage;
