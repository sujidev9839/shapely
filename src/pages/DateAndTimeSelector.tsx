import DayPicker from '../components/DayPicker';
import AvailableSlots from '../components/AvailableTimeSlots';
import { localStrings } from '../utils/Constants';
import { Card, Col, Container, Row } from 'react-bootstrap';


function DateTimeSelector() {
  return (
    <>
      <h1 className="!text-3xl mb-3 !font-bold">{localStrings.GREET_MEET_YOUR_SHAPELY_PROVIDER}</h1>
      <h5 className="mb-3">{localStrings.WHAT_TIME_WORKS_BEST}</h5>
      <Card className="card p-4 !shadow-md !rounded-2xl">
        <h5 className='text-center mb-3'>
          {localStrings.SELECT_DATE_TIME}
        </h5>
        <Container>
          <Row>
            <Col md={12} lg={6} xl={6} sm={12} xs={12}>
              <DayPicker />
            </Col>
            <Col md={12} lg={6} xl={6} sm={12} xs={12}>
              <AvailableSlots />
            </Col>
          </Row>
        </Container>
      </Card>
    </>
  );

}

export default DateTimeSelector;
