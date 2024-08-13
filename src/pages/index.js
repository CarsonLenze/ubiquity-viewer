import Card from 'react-bootstrap/Card';
import { Row, Container, Button, Modal, Pagination } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function getProductLines(devices) {
  const products = [];

  for (const device of devices) {
    const line = products.find(line => line.id === device.line.id);

    if (!line) products.push({ id: device.line.id, name: device.line.name, count: 1 });
    if (line) line.count++;
  }

  return products;
}

function DeviceCard(props) {
  const device = props.device;

  const image_url = ('https://static.ui.com/fingerprint/ui/images/' + device.id + '/default/' + device.images.default + '.png');

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={image_url} />
      <Card.Body>
        <Card.Title>{device.product.name}</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text> */}
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
  );
}

export default function Home() {
  const [data, setData] = useState({ devices: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(5);

  const loadData = (devices, first_load = false) => {
    if (first_load) {
      const products = getProductLines(devices);

      //format devices here
      setData({ devices: devices, products: products })
    }

    var items = devices.slice((page * 50) - 50, page * 50);
    setItems(items);
  }

  useEffect(() => {
    const url = 'https://static.ui.com/fingerprint/ui/public.json';

    fetch(url)
      .then(res => res.json())
      .then(json => {
        loadData(json.devices, true);
        setLoading(false);
      })
  }, [])

  useEffect(() => {
    if (loading === false && data?.devices) loadData(data.devices);
  }, [page]);

  if (loading) return <>Loading</>

  return (
    <>
    <Button onClick={() => { setPage(page + 1)}}>Press</Button>
    <Container>
    <Row>
      {items.map(device => <DeviceCard device={device} key={device.id} />)}
      </Row>
      </Container>
    </>
  );
}
