import prisma from '../../../libs/prisma'
import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'

export default async (req, res) => {
  session(req, res)

  if (req.method === 'GET') {
    // console.time('get all items from sqlite')
    const notes = (await prisma.note.findMany())
      .map(note => JSON.stringify(note))
      .map(note => JSON.parse(note))
      .sort((a, b) => b.id - a.id)

    // console.timeEnd('get all items from sqlite')
    return res.send(JSON.stringify(notes))
  }

  if (req.method === 'POST') {
    const login = req.session.login

    if (!login) {
      return res.status(403).send('Unauthorized')
    }

    // console.time('create item from sqlite')

    const newNote = await prisma.note.create({
      data: {
        title: (req.body.title || '').slice(0, 255),
        updated_at: new Date().toISOString(),
        body: (req.body.body || '').slice(0, 2048),
        created_by: login
      }
    })
    // console.timeEnd('create item from sqlite')

    return sendRes(req, res, newNote.id)
  }

  return res.send('Method not allowed.')
}
