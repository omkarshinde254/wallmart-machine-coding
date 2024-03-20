import { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import RowModel from "components/RowModel";
import { toast } from "components/ui/use-toast";

const locationArr = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"];
const channelArr = ["Channel 1", "Channel 2", "Channel 3", "Channel 4", "Channel 5", "Channel 6"];
// const BASE_URL = "http://localhost:3001";
const BASE_URL = "https://wallmart-machine-coding-backend.vercel.app";

type Schedule = {
    key: number;
    startDate: Date | undefined;
    endDate: Date | undefined;
    channel: string;
    location: string;
};

function App() {
    const [currStateArr, setCurrStateArr] = useState<Schedule[]>([]);
    const [deleteKey, setDeleteKey] = useState<number[]>([]);

    // make a fetch request to the server to get data
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/get/schedule/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = (await response.json()) as Schedule[];

                // Convert string dates to Date objects
                const formattedData = data.map((item) => ({
                    ...item,
                    startDate: new Date(item?.startDate!),
                    endDate: new Date(item?.endDate!),
                }));

                // console.log("Inp dat:: ", formattedData);
                setCurrStateArr((prev) => formattedData);
            } catch (error) {
                console.error("Error fetching schedule data:", error);
            }
        })();
    }, []);

    const saveOrUpdateSchedules = async (schedules: Schedule[]) => {
        try {
            const response = await fetch(`${BASE_URL}/api/create_or_update/schedule/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currStateArr),
            });

            if (!response.ok) {
                throw new Error("Failed to save schedules to database");
            }

            return true;
        } catch (error: any) {
            console.error("Error saving or updating schedules:", error);
            toast({
                title: "Failed to save schedules",
                description: error.message,
                variant: "destructive",
            });
            throw error;
        }
    };

    const deleteSchedules = async (keys: number[]) => {
        try {
            const response = await fetch(`${BASE_URL}/api/delete/schedule/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(keys),
            });

            if (!response.ok) {
                throw new Error("Failed to delete schedules from database");
            }

            return true;
        } catch (error: any) {
            console.error("Error deleting schedules:", error);
            toast({
                title: "Failed to delete schedules",
                description: error.message,
                variant: "destructive",
            });
            throw error;
        }
    };

    const validateSchedules = (schedules: Schedule[]) => {
        for (let i = 0; i < schedules.length; i++) {
            if (!schedules[i].startDate || !schedules[i].endDate || schedules[i].channel === "Select Channel" || schedules[i].location === "Select Location") {
                return false;
            }
        }
        return true;
    };

    const onSaveHandler = async () => {
        if (!validateSchedules(currStateArr)) {
            toast({
                title: "Invalid Schedules",
                description: "Please fill all the fields",
                variant: "destructive",
            });
            return;
        }
        try {
            if (currStateArr.length > 0) {
                await saveOrUpdateSchedules(currStateArr);
            }

            if (deleteKey.length > 0) {
                await deleteSchedules(deleteKey);
            }

            toast({
                title: "Schedules updated successfully",
                description: "Schedules updated successfully to DB",
                variant: "success",
            });
        } catch (error) {}
    };

    const onScheduleAdd = () => {
        setCurrStateArr((prev) => [
            ...prev,
            { key: prev.length, startDate: undefined, endDate: undefined, channel: "Select Channel", location: "Select Location" },
        ]);
    };

    const onScheduleRemove = (key: number) => {
        setCurrStateArr((prev) => prev.filter((itm) => itm.key !== key));
        setDeleteKey((prev) => [...prev, key]);
    };

    const setCurrentElemState = (key: number, scheduleKey: string, value: any) => {
        setCurrStateArr((prevState) => {
            const newState = [...prevState];
            const idx = newState.findIndex((item) => item.key === key);
            newState[idx] = { ...newState[idx], [scheduleKey]: value };
            return newState;
        });
    };

    const handleClearAll = () => {
        const currKeys = currStateArr.map((item) => item.key);
        setCurrStateArr([]);
        setDeleteKey((prev) => [...prev, ...currKeys]);
    };

    return (
        <>
            <Button variant="link" size="lg" className="text-blue-600 underline" onClick={onScheduleAdd}>
                + Add Schedule
            </Button>
            {currStateArr.map((item, idx) => (
                <RowModel
                    key={item.key}
                    rowIdx={item.key}
                    locationArr={locationArr}
                    channelArr={channelArr}
                    startDateInp={item.startDate}
                    endDateInp={item.endDate}
                    channelInp={item.channel}
                    locationInp={item.location}
                    onScheduleRemove={onScheduleRemove}
                    setCurrentElemState={setCurrentElemState}
                />
            ))}

            {/* Save Button */}
            <div className="flex justify-center mt-20">
                <Button variant="outline" size="lg" className="bg-green-400 mr-2" onClick={onSaveHandler}>
                    Save
                </Button>

                <Button variant="outline" size="lg" className="bg-red-400 ml-2" onClick={handleClearAll}>
                    Clear All
                </Button>
            </div>
        </>
    );
}

export default App;
