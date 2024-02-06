//This's only example of the template
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
};

export default function PageWrapper({
  children,
  className,
  ...rest
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...rest}>
      {children}
    </div>
  );
}
