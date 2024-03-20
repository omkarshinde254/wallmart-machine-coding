import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Calendar } from "./ui/calendar";
import { cn } from "lib/utils";
import { format } from "date-fns";
import { Label } from "./ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { start } from "repl";
import { toast } from "./ui/use-toast";

type Props = {
    rowIdx: number;
    locationArr: string[];
    channelArr: string[];
    startDateInp: Date | undefined;
    endDateInp: Date | undefined;
    channelInp: string;
    locationInp: string;
    // setCurrStateArr: React.Dispatch<React.SetStateAction<{ startDate: Date; endDate: Date; channel: string; location: string }[]>>;
    onScheduleRemove: (idx: number) => void;
    setCurrentElemState: (idx: number, key: string, value: any) => void;
};

const RowModel = ({ rowIdx, locationArr, channelArr, startDateInp, endDateInp, locationInp, channelInp, onScheduleRemove, setCurrentElemState }: Props) => {
    const [startDate, setStartDate] = useState<Date | undefined>(startDateInp);
    const [endDate, setEndDate] = useState<Date | undefined>(endDateInp);
    const [channel, setChannel] = useState(channelInp);
    const [location, setLocation] = useState(locationInp);

    useEffect(() => {
        setCurrentElemState(rowIdx, "startDate", startDate);
        setCurrentElemState(rowIdx, "endDate", endDate);
        setCurrentElemState(rowIdx, "channel", channel);
        setCurrentElemState(rowIdx, "location", location);
    }, [startDate, endDate, channel, location]);

    const handleStartDateSelect = (date: Date | undefined) => {
        if (date) {
            setStartDate(date);
        }
    };

    const handleEndDateSelect = (date: Date | undefined) => {
        if (date) {
            setEndDate(date);
        }
    };

    // useEffect(() => {
    //     console.log("RowModel useEffect: ", currStateArr);
    // }, [currStateArr]);

    // const onRemoveRow = () => {
    //     console.log("Remove Row: ", rowIdx, currStateArr[rowIdx], currStateArr);
    //     setCurrStateArr((prev) => prev.filter((_, idx) => idx !== rowIdx));
    // };

    return (
        <div className="flex gap-20 py-2 ml-24">
            <span>
                <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">
                        Start Date <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={startDate} onSelect={handleStartDateSelect} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </span>

            <span>
                <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">
                        End Date <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={endDate} onSelect={handleEndDateSelect} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </span>

            <span>
                <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">Channel</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg" className="w-40 text-left justify-start">
                                {channel}
                                <span>
                                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={channel} onValueChange={setChannel}>
                                {channelArr.map((item, idx) => (
                                    <DropdownMenuRadioItem key={idx} value={item}>
                                        {item}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </span>

            <span>
                <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">Location</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg" className="w-40 text-left justify-start">
                                {location}
                                <span>
                                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={location} onValueChange={setLocation}>
                                {locationArr.map((item, idx) => (
                                    <DropdownMenuRadioItem key={idx} value={item}>
                                        {item}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </span>

            <span>
                <Button
                    variant="destructive"
                    size="sm"
                    className="mt-8 -ml-14 font-bold text-md"
                    onClick={() => {
                        onScheduleRemove(rowIdx);
                    }}
                >
                    -
                </Button>
            </span>
        </div>
    );
};

export default RowModel;
