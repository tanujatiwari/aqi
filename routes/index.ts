import express from 'express'
const router = express.Router()

import publicControllerClass from '../controllers'
import { DatabaseQueries } from '../db/index'
import { MockDatabaseQueries } from '../db/mock'

const userControllers = new publicControllerClass(new MockDatabaseQueries())

router.get('/', userControllers.home)

router.all('*', userControllers.notFound)

export default router;