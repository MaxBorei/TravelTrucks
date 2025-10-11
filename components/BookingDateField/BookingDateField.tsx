"use client";

import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import css from "./BookingDateField.module.css";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingDateField() {
  const [value, setValue] = useState<Date | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  return (
    <DatePicker
      className={css.input}
      selected={value}
      onChange={(d) => setValue(d)}
      dateFormat="dd.MM.yyyy"
      placeholderText="Booking date*"
      name="date"
      required
      wrapperClassName={css.wrapper}
      minDate={today}
      filterDate={(d) => d >= today}
    />
  );
}
