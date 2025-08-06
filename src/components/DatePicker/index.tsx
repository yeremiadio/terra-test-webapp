import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { DateRange, Matcher, OnSelectHandler } from 'react-day-picker';
import { id } from 'react-day-picker/locale';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'; // Assuming Radix UI popover components

import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';

dayjs.locale('id');

interface DatePickerProps {
  value?: DateRange;
  onChange?: OnSelectHandler<DateRange | undefined>;
  disabled?: Matcher | Matcher[];
  defaultMonth?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled,
  defaultMonth,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full lg:w-[220px] pl-3 text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          {value ? (
            `${dayjs(value?.from ?? new Date()).format('DD/MM/YYYY')} - ${dayjs(value?.to ?? new Date()).format('DD/MM/YYYY')}`
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          onSelect={onChange}
          selected={value}
          defaultMonth={defaultMonth}
          locale={id}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};
