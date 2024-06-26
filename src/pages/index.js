import { useEffect, useState } from "react";

export default function Home() {
  return (
    <>
    <>Hello</>
    </>
  );
}

export async function getServerSideProps(context) {
  const url = 'https://static.ui.com/fingerprint/ui/public.json';
  const res = await fetch(url);
  const json = await res.json();

  const filterd = json.devices.filter(x => x.sku === "UNAS-Pro");

  return {
    props: {
        data: filterd
    }
  }
}
