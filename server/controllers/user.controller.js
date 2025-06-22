import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import sendEmail from '../config/sendEmail.js'

export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body

    if (!name || !email || !password) {
      return response.status(400).json({
        message: 'Provide email, name, password',
        error: true,
        success: false,
      })
    }

    const user = await UserModel.findOne({ email })

    if (user) {
      return response.json({
        message: 'Already register email',
        error: true,
        success: false,
      })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(password, salt)

    const payload = {
      name,
      email,
      password: hashPassword,
    }

    const newUser = new UserModel(payload)
    const save = await newUser.save()

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: 'Verify email from Blinkit',
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    })

    return response.json({
      message: 'User register successfully',
      error: false,
      success: true,
      data: save,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body

    const user = await UserModel.findOne({ _id: code })

    if (!user) {
      return response.status(400).json({
        message: 'Invalid code',
        error: true,
        success: false,
      })
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    )

    return response.json({
      message: 'Verify email done',
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}
