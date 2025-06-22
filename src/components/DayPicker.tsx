import DatePicker from 'react-datepicker';
import { useQuery, gql } from "@apollo/client";
import { useContext, useEffect, useMemo } from 'react';
import { parse } from 'date-fns';
import { CallSchedulerContext } from '../context/CallSchedulerContext';
import useAppointmentTypes from '../hooks/useAppointmentTypes';
import { DateTime } from "luxon";
import Skeleton from "react-loading-skeleton";

// GraphQL Queries
const DAYS_AVAILABLE_FOR_RANGE = gql`
query daysAvailableForRange(
  $provider_id: String
  $date_from_month: String
  $org_level: Boolean
  $contact_type: String
  $timezone: String
  $provider_ids: [String]
  $appt_type_id: String
  $appt_loc_id: String
  $clients_can_join_waitlist: Boolean,
  $appointment_to_reschedule_id: ID,
) {
  daysAvailableForRange(
    provider_id: $provider_id
    date_from_month: $date_from_month
    org_level: $org_level
    contact_type: $contact_type
    timezone: $timezone
    provider_ids: $provider_ids
    appt_type_id: $appt_type_id
    appt_loc_id: $appt_loc_id
    clients_can_join_waitlist: $clients_can_join_waitlist,
    appointment_to_reschedule_id: $appointment_to_reschedule_id,
  )
}`;

const NEXT_AVAILABLE_SLOT = gql`
query nextAvailableSlot(
  $provider_id: String
  $org_level: Boolean
  $timezone: String
  $appt_type_id: String
  $provider_ids: [String]
) {
  nextAvailableSlot(
    provider_id: $provider_id
    org_level: $org_level
    timezone: $timezone
    appt_type_id: $appt_type_id
    provider_ids: $provider_ids
  )
}`;

function DayPicker() {
  const context = useContext(CallSchedulerContext);
  if (!context) return null;

  const {
    stateDate,
    setStartDate,
    providerIds,
    timezone,
    provider_id,
    org_level
  } = context;

  const { appointmentType } = useAppointmentTypes(provider_id);

  const timeZone = timezone || "UTC";

  // Format for sending to API
  const luxonDate = DateTime.fromJSDate(stateDate).setZone(timeZone);
  const dateFromMonth = luxonDate.startOf("day").toFormat("EEE MMM dd yyyy HH:mm:ss 'GMT'ZZ (z)");

  // Fetch available days
  const { data, refetch: refetchAvailableDays, loading } = useQuery(DAYS_AVAILABLE_FOR_RANGE, {
    variables: {
      org_level,
      clients_can_join_waitlist: false,
      date_from_month: stateDate ? dateFromMonth : "",
      timezone: timeZone,
      appt_type_id: appointmentType?.id,
      provider_id,
      contact_type: appointmentType?.available_contact_types[0],
      provider_ids: providerIds
    }
  });

  // Fetch next available slot
  const {
    data: nextAvailableSlot
  } = useQuery(NEXT_AVAILABLE_SLOT, {
    variables: {
      provider_id,
      timezone: timeZone,
      org_level,
      appt_type_id: appointmentType?.id,
      provider_ids: providerIds,
    },
  });
  

  useEffect(() => {
    if (nextAvailableSlot?.nextAvailableSlot && timeZone) {
      const rawString = nextAvailableSlot.nextAvailableSlot;
  
      const luxonDate = rawString.includes("T")
        ? DateTime.fromISO(rawString, { setZone: true }).setZone(timeZone)
        : DateTime.fromFormat(rawString, "yyyy-MM-dd", { zone: timeZone });
  
      if (!luxonDate.isValid) {
        console.error("❌ Invalid date format:", rawString);
        return;
      }
  
      const { year, month, day } = luxonDate;
  
      const localMidnight = new Date(year, month - 1, day);
  
      setStartDate(localMidnight as any);
    }
  }, [nextAvailableSlot?.nextAvailableSlot, timeZone]);
  

  // Highlight available days
  const highlightDates = useMemo(() => {
    return data?.daysAvailableForRange?.map((day: string) =>
      parse(day, "yyyy-MM-dd", new Date())
    ) || [];
  }, [data]);

  // fetch available days on month change
  const handleMonthChange = (date: Date) => {
    const luxonDate = DateTime.fromJSDate(date).setZone(timeZone);
    const dateFromMonth = luxonDate.startOf("day").toFormat("EEE MMM dd yyyy HH:mm:ss 'GMT'ZZ (z)");
    setStartDate(date as any)
  
    // Refetch available days on month change
    refetchAvailableDays({
      org_level,
      clients_can_join_waitlist: false,
      date_from_month: dateFromMonth,
      timezone: timeZone,
      appt_type_id: appointmentType?.id,
      provider_id,
      contact_type: appointmentType?.available_contact_types[0],
      provider_ids: providerIds
    });
  };

  if (!stateDate) return null;

  return (
    <div className="book-cal-container">

      {loading ? (
        <Skeleton height={380} width={"100%"} borderRadius={8} />
      ) : (
        <DatePicker
          inline
          onChange={(date: any) => setStartDate(date)}
          useWeekdaysShort={true}
          selected={stateDate}
          onMonthChange={handleMonthChange}
          highlightDates={highlightDates}
        />
      )}
    </div>
  );
}

export default DayPicker;
