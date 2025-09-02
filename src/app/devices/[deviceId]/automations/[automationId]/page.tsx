export default async function AutomationPage({
  params,
}: {
  params: Promise<{ deviceId: string; automationId: string }>;
}) {
  const { deviceId, automationId } = await params.then((params) => ({
    deviceId: params.deviceId,
    automationId: Number(params.automationId),
  }));

  return <pre>{JSON.stringify({ deviceId, automationId }, null, 2)}</pre>;
}
