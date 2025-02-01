'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, User, UserCircle } from 'lucide-react'
import { Form } from '@doc/design-system/components/ui/form'
import { Button } from '@doc/design-system/components/ui/button'
import InputWithIcon from '@doc/design-system/components/form/input-with-icon'
import { doctorFormSchema, type DoctorForm } from '@doc/database/schema/doctors'

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

  async function onSubmit(data: DoctorForm) {
    // TODO: Implement form submission
    console.log(data)
  }

  return (
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

        <Button type="submit" className="w-full">
          Create Doctor
        </Button>
      </form>
    </Form>
  )
}
