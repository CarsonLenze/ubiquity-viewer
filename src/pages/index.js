import Card from 'react-bootstrap/Card';
import { Container, Row, Col, Button, Modal, Offcanvas } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function DeviceCard(props) {
  const device = props.device;

  const image_url = ('https://static.ui.com/fingerprint/ui/images/' + device.id + '/default/' + device.images.default + '.png');

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={image_url} />
      <Card.Body>
        <Card.Title>{device.product.name}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
  );
}

export default function Home(props) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(null);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  const filterData = (devices) => {
    var items = devices.devices.slice((page * 100) - 100, page * 100);
    setItems(items);
  }

  useEffect(() => {
    const url = 'https://static.ui.com/fingerprint/ui/public.json';

    fetch(url)
      .then(res => res.json())
      .then(json => {
        setData(json)
        filterData(json)
        setLoading(false);
      })
  }, [])

  if (loading) return <>Loading</>

  return (
    <>
    <Row>
      {items.map(device => <DeviceCard device={device} key={device.id} />)}
      </Row>
    </>
  );
}

export async function getServerSideProps(context) {
  const url = 'https://static.ui.com/fingerprint/ui/public.json';
  const res = await fetch(url);
  const json = await res.json();

  const devices = json.devices;

  const lines = {}
  for (const device of devices) {
    if (!lines[device.line.id]) {
      lines[device.line.id] = { name: device.line.name, count: 1}
    } else lines[device.line.id].count++
  }

  // console.log(lines)

  let page = 1
  var items = devices.slice((page * 100) - 100, page * 100);
  console.log((page * 100) - 100, page * 100)

  return {
    props: {
      device: items
    }
  }
}
