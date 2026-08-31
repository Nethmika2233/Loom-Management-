import { useState } from "react";
import { format, parse, setHours, setMinutes } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DueDatePickerProps {
  value?: string; // ISO string
  onChange: (iso: string | undefined) => void;
  className?: string;
}

export function DueDatePicker({ value, onChange, className }: DueDatePickerProps) {
  const [open, setOpen] = useState(false);
  const date = value ? new Date(value) : undefined;

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;
    const withTime = date ? setMinutes(setHours(day, date.getHours()), date.getMinutes()) : setHours(setMinutes(day, 0), 9);
    onChange(withTime.toISOString());
  };

  const handleTimeChange = (time: string) => {
    if (!date) return;
    const [h, m] = time.split(":").map(Number);
    onChange(setMinutes(setHours(date, h), m).toISOString());
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("h-8 justify-start px-2.5 text-sm font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
            {date ? format(date, "MMM d, yyyy 'at' HH:mm") : "Pick a date & time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={handleDaySelect}
            classNames={{
              day_selected: "bg-primary-600 text-white rounded-full",
              today: "font-bold underline",
            }}
          />
          <div className="mt-2 flex items-center gap-2 border-t border-border pt-2">
            <span className="text-xs font-semibold text-muted-foreground">Time</span>
            <input
              type="time"
              className="h-7 rounded-md border border-input bg-background px-2 text-sm"
              value={date ? format(date, "HH:mm") : "09:00"}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
            {date && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-7 text-xs text-destructive"
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}