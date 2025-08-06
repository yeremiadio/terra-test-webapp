import { useEffect, useState } from 'react';

const TimeDisplay = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="text-sm">
      {date.getDate()} {date.toLocaleString('id-ID', { month: 'long' })}{' '}
      {date.getFullYear()} - {date.getHours() < 10 ? '0' : ''}
      {date.getHours()}:{date.getMinutes() < 10 ? '0' : ''}
      {date.getMinutes()}:{date.getSeconds() < 10 ? '0' : ''}
      {date.getSeconds()} (GMT +7)
    </div>
  );
};

export default TimeDisplay;
