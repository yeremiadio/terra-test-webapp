import { ReactNode, FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
};

const PageWrapper: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cn('', className)} {...rest}>
    {children}
  </div>
);

export default PageWrapper;
