import * as express from 'express'
import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
// import { MultiTenant } from 'prisma-multi-tenant'

export const createTenant = async (req: any, res: any, next: any) => {
  
  const username = req.body.username
  const password = req.body.password
  const fullname = req.body.fullname
  const description = req.body.description
  const image = req.body.image
  const email = req.body.email

  if (!username) {
    res.status(400).json({ success: false, message: 'username is required' });
    return
  }
  try {
    // const multiTenant = new MultiTenant<PrismaClient>();
    const prisma = new PrismaClient()
    const hashedPassword = await hash(password, 10)
    await prisma.user.create({
      data: {
        username,
        bio: '',
        fullname,
        image,
        email,
        password: hashedPassword,
        owner: '1',
        social: '',
        role: {
          create: [
            {
              title: 'Admin',
              roleSettings:
                'manage_community,manage_channel,manage_role,chat_permission,upload_image,post_links,delete_message',
              color: '#9B59B6'
            },
            {
              title: 'Manager',
              roleSettings:
                'manage_community,manage_channel,chat_permission,upload_image,post_links,delete_message',
              color: '#3398DB'
            },
            {
              title: 'Member',
              roleSettings:
                'manage_community,manage_channel,chat_permission,upload_image,post_links',
              color: '#2FCC71'
            }
          ]
        }
      }
    })

    await prisma.community.create({
      data: {
        name: 'General',
        url: 'general',
        image: 'http://ec2-3-20-204-242.us-east-2.compute.amazonaws.com:3000/favicon.svg',
        description,
        channels: {
          create: [
            {
              name: 'general',
              description: 'Talk on a general topic',
              url: `general/general`,
              author: { connect: { username } },
            }
          ]
        },
        author: { connect: { username } },
        members: { connect: { username } }
      }
    })

    await prisma.community.create({
      data: {
        name: 'Private',
        url: 'direct',
        image: 'https://ciscord.com/image/article/1566410146060channel6.png',
        description,
        channels: {
          create: [
            {
              name: 'general',
              description: 'Talk on a general topic',
              url: `direct/general`,
              author: { connect: { username } },
            }
          ]
        },
        author: { connect: { username } },
        members: { connect: { username } }
      }
    })

    res.status(201).json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const deleteTenant = async (req: any, res: any, next: any) => {
  // try {
  //   const name = req.body.tenantName

  //   const multiTenant = new MultiTenant()
  //   await multiTenant.deleteTenant(name)

  //   await multiTenant.disconnect()
  // } catch (err) {
  //   next(err)
  // }
}

const router = express.Router()

router.post('/', createTenant)
router.delete('/', deleteTenant)

export default router
