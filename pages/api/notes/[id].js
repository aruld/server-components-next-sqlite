import prisma from '../../../libs/prisma'
import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'

export default async (req, res) => {
  session(req, res)
  const id = +req.query.id
  const login = req.session.login

  const result = JSON.stringify(
    await prisma.note.findUnique({
      where: { id: Number(id) },
    })
  )
  console.log(result)
  const note = JSON.parse(result || 'null')

  if (req.method === 'GET') {
    return res.send(JSON.stringify(note))
  }

  if (req.method === 'DELETE') {
    if (!login || login !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    await prisma.note.delete({
      where: { id: Number(id) },
    })

    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    if (!login || login !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    await prisma.note.update({
      where: { id: Number(id) },
      data: {
        title: (req.body.title || '').slice(0, 255),
        updated_at: new Date().toISOString(),
        body: (req.body.body || '').slice(0, 2048),
        created_by: login,
      },
    })

    return sendRes(req, res, null)
  }

  return res.send('Method not allowed.')
}
