export default function Location({ params }: { params: { locationName: string } }) {
  return <div>{params.locationName}</div>;
}
