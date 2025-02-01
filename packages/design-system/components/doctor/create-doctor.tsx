'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, User, UserCircle } from 'lucide-react'
import { Form } from '@doc/design-system/components/ui/form'
import { Button } from '@doc/design-system/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@doc/design-system/components/ui/card'
import InputWithIcon from '@doc/design-system/components/form/input-with-icon'
import { doctorFormSchema, type DoctorForm } from '@doc/database/schema/doctors'
import { createDoctor } from '@doc/design-system/actions/doctors/create-doctor'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Spinner from '../misc/spinner'

export default function CreateDoctor() {
  const form = useForm<DoctorForm>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
    },
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(data: DoctorForm) {
    const response = await createDoctor(data)
    router.refresh()
  }

  return (
    <Card className="w-full p-4">
      <CardHeader>
        <CardTitle className="font-heading">Create Doctor</CardTitle>
        <CardDescription>Add a new doctor to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputWithIcon
              control={form.control}
              name="username"
              label="Username"
              placeholder="Enter your username"
              icon={<User />}
              required
            />

            <InputWithIcon
              control={form.control}
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
              icon={<UserCircle />}
              required
            />

            <InputWithIcon
              control={form.control}
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              icon={<UserCircle />}
              required
            />

            <InputWithIcon
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
              icon={<Mail />}
              type="email"
              required
            />

            <Button
              type="submit"
              className="w-full"
              variant="shine"
              disabled={loading}
            >
              {loading ? <Spinner /> : 'Create Doctor'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
