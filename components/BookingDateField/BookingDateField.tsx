"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import css from "./BookingDateField.module.css";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingDateField() {
  const [value, setValue] = useState<Date | null>(null);
  const WEEKDAYS_3 = ["SUN", "MON", "TUE", "WED", "THE", "FRI", "SAT"];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const today = d;

  return (
    <DatePicker
      className={css.input}
      selected={value}
      onChange={(d) => setValue(d)}
      dateFormat="dd.MM.yyyy"
      placeholderText="Booking date*"
      name="date"
      required
      calendarStartDay={1}
      formatWeekDay={(nameOfDay: string) => {
        const idx = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].findIndex((full) => nameOfDay.startsWith(full.slice(0, 3)));
        return idx >= 0 ? WEEKDAYS_3[idx] : nameOfDay.slice(0, 3);
      }}
      wrapperClassName={css.wrapper}
      minDate={today}
      filterDate={(d) => d >= today}
    />
  );
}
