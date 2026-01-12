import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PrimaryButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn('btn-primary', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
PrimaryButton.displayName = 'PrimaryButton';

const SecondaryButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn('btn-secondary', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
SecondaryButton.displayName = 'SecondaryButton';

export { PrimaryButton, SecondaryButton };
