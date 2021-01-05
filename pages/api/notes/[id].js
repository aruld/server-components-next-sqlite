import prisma from '../../../libs/prisma'
import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'

export default async (req, res) => {
  session(req, res)
  const id = +req.query.id
  const login = req.session.login

  // console.time('get item from sqlite')
  const result = JSON.stringify(await prisma.note.findUnique({
    where: {id: Number(id)}
  }))
  const note = JSON.parse(result || 'null')
  // console.timeEnd('get item from sqlite')

  if (req.method === 'GET') {
    return res.send(JSON.stringify(note))
  }

  if (req.method === 'DELETE') {
    if (!login || login !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    // console.time('delete item from sqlite')
    await prisma.note.delete({
      where: {id: Number(id)}
    })
    // console.timeEnd('delete item from sqlite')

    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    if (!login || login !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    // console.time('update item from sqlite')
    await prisma.note.update({
      where: {if: Number(id)},
      data: {
        title: (req.body.title || '').slice(0, 255),
        updated_at: Date.now(),
        body: (req.body.body || '').slice(0, 2048),
        created_by: login,
      }
    })
    // console.timeEnd('update item from sqlite')

    return sendRes(req, res, null)
  }

  return res.send('Method not allowed.')
}
