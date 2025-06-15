import { useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";

const GET_APPOINTMENT_TYPES = gql`
  query appointmentTypes($clients_can_book: Boolean, $provider_id: String) {
    appointmentTypes(provider_id: $provider_id, clients_can_book: $clients_can_book) {
      id
      name
      length
      available_contact_types
      is_group
    }
  }
`;

const useAppointmentTypes = (provider_id: string) => {
  const searchParams = new URLSearchParams(useLocation().search);
  const appointmentName = searchParams.get("appointment_name");

  const { data, loading, error } = useQuery(GET_APPOINTMENT_TYPES, {
    variables: {
      clients_can_book: true,
      provider_id,
    },
  });
  
  const appointmentType = useMemo(() => {
    if (data?.appointmentTypes && appointmentName) {
      return data.appointmentTypes.find(
        (appointmentType: any) => appointmentType.name === appointmentName
      );
    }
    return null;
  }, [data, appointmentName]);

  return {
    appointmentType,
    loading,
    error,
  };
};

export default useAppointmentTypes;
