import { useQuery, gql } from "@apollo/client";
import { localStrings } from "../utils/Constants";

const APPOINTMENT_TYPES = gql`
    query appointmentTypes(
                           $clients_can_book: Boolean,
                            $provider_id: String
    ) {
        appointmentTypes(provider_id: $provider_id,
                         clients_can_book: $clients_can_book ) {
          id
          name
          length
          available_contact_types
          is_group
        }
    }
  `;

function AppointmentTypes() {
    const { data } = useQuery(APPOINTMENT_TYPES, {
        variables: { provider_id: "1989481", clients_can_book: true },
    });
    return (
        <>
            <h1 className="!text-3xl mb-3 !font-bold">{localStrings.SELECT_APPOINTMENT_TYPE}</h1>
            {data?.appointmentTypes?.map((appointment: any) => {
                return (
                    <div>
                        {appointment.name}
                    </div>
                )
            })}
        </>
    )
}

export default AppointmentTypes