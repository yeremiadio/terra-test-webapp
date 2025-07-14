import { ReactNode, FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type Props = { children: ReactNode };

const ContentWrapper: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cn(``, className)} {...rest}>
    {children}
  </div>
);

export default ContentWrapper;
