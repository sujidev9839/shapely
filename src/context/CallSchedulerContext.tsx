import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { stateToTimeZone } from '../utils/timezoneList';

interface CallSchedulerContextType {
  step: string;
  setStep: React.Dispatch<React.SetStateAction<string>>;
  stateDate: any;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  selectedSlots: any;
  setSelectedSlots: React.Dispatch<React.SetStateAction<string>>;
  bookedAppointment: any;
  setBookedAppointment: React.Dispatch<React.SetStateAction<string>>
  providerIds: any;
  setProviderIds: React.Dispatch<React.SetStateAction<string>>;
  timezone: any;
  setTimezone: React.Dispatch<React.SetStateAction<string>>;
  provider_id: string;
  org_level: boolean;
  first_name: string;
  last_name: string;
  email: string; 
  phone_number: string; 
  offering_id: string;
}

export const CallSchedulerContext = createContext<CallSchedulerContextType | undefined>(undefined);

interface CallSchedulerProviderProps {
  children: ReactNode;
}

export const CallSchedulerProvider: React.FC<CallSchedulerProviderProps> = ({ children }) => {
  const searchParams = new URLSearchParams(useLocation().search);
  const [step, setStep] = useState<string>("dateTime");
  const [stateDate, setStartDate] = useState<any>("");
  const [bookedAppointment, setBookedAppointment] = useState<any>();
  const [selectedSlots, setSelectedSlots] = useState<any>()
  const [providerIds, setProviderIds] = useState<any>(["1857881", "2612119", "1857865"]);
  const [timezone, setTimezone] = useState({})
  const provider_id = searchParams.get("dietitian_id") ?? "";
  const org_level = searchParams.get("org_level") === "true";
  const state = searchParams.get("state");
  const first_name = searchParams.get("first_name") ?? "";
  const last_name = searchParams.get("last_name") ?? "";
  const email = searchParams.get("email") ?? "";
  const phone_number = searchParams.get("phone_number") ?? "";
  const offering_id = searchParams.get("offering_id") ?? "";

    const fetchData = async () => {
    const url = `https://zoho-solution-887781528.development.catalystserverless.com/server/zohocrm/providers/?state=${state}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const stringIds = result?.output.map((id:number) => String(id));
      setProviderIds(stringIds);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleSearch = async () => {
    if (!state) return;
    try {
      // const data = await fetchTimezone(state);
      const getTimeZone = (state:any) => stateToTimeZone[state] || 'UTC';
      const timeZone = getTimeZone(state);
      setTimezone(timeZone)
    } catch (e: any) {
    } finally {
    }
  };

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <CallSchedulerContext.Provider value={{ step, setStep, stateDate, setStartDate, selectedSlots, setSelectedSlots, bookedAppointment, setBookedAppointment, providerIds, setProviderIds, timezone, setTimezone, provider_id, org_level, first_name, last_name, email, phone_number, offering_id }}>
      {children}
    </CallSchedulerContext.Provider>
  );
};
