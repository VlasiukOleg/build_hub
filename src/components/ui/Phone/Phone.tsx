import { FaSquarePhone } from 'react-icons/fa6';

const Phone: React.FC = () => {
  return (
    <a
      href="tel:+380632790437"
      className="flex gap-1 items-center text-xs font-semibold md:text-lg"
    >
      <FaSquarePhone className="size-6 md:size-5 text-green-500" />
      (066) 719 60 74
    </a>
  );
};

export default Phone;
