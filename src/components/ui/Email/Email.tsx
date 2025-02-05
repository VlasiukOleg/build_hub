import { MdEmail } from 'react-icons/md';

const Email: React.FC = () => {
  return (
    <a
      href="mailto:budstock@gmail.com"
      className="flex gap-1 items-center text-sm font-semibold md:text-lg"
    >
      <MdEmail className="size-6 md:size-5 text-green-500" />
      budstock@gmail.com
    </a>
  );
};

export default Email;
