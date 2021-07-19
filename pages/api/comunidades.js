import { SiteClient } from 'datocms-client';

export default async function RequestsAll(request, response) {

  if (request.method === 'POST') {
    const TOKEN = '84e467d125a7a1f1c8d6e3bc8f45b0';

    const client = new SiteClient(TOKEN);

    const record = await client.items.create({
      itemType: "977478",
      ...request.body,
    })

    response.json({
      dados: 'Alguma coisa',
      record: record
    });

    return;
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST tem!'
  })
};