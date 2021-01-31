import prisma from '../../../libs/prisma'
import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'

export default async (req, res) => {
  session(req, res)

  if (req.method === 'GET') {
    try {
      const notes = await prisma.note.findMany({
        orderBy: [
          {
            id: 'desc',
          },
        ],
      })
      return res.send(JSON.stringify(notes))
    } catch (error) {
      console.error(error)
      return res.status(error.status || 500).end(error.message)
    }
  }

  if (req.method === 'POST') {
    const login = req.session.login

    if (!login) {
      return res.status(403).send('Unauthorized')
    }

    const newNote = await prisma.note.create({
      data: {
        title: (req.body.title || '').slice(0, 255),
        updated_at: new Date().toISOString(),
        body: (req.body.body || '').slice(0, 2048),
        created_by: login,
      },
    })

    return sendRes(req, res, newNote.id)
  }

  return res.send('Method not allowed.')
}
