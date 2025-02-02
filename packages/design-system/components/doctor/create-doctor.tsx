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
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@doc/design-system/lib/query-keys'

export default function CreateDoctor() {
  const form = useForm<DoctorForm>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
    },
    mode: 'onChange',
  })
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  async function onSubmit(data: DoctorForm) {
    try {
      if (!form.formState.isValid) {
        return toast.error('Please fill in all fields', {
          description: Object.values(form.formState.errors)
            .map((error) => error.message)
            .join(', '),
        })
      }
      setLoading(true)
      await createDoctor(data)
      form.reset()
      toast.success('Doctor created successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS] })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create doctor'
      )
    } finally {
      setLoading(false)
    }
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

        <Button
          type="submit"
          className="w-full"
          variant="shine"
          disabled={loading || !form.formState.isValid}
        >
          {loading ? <Spinner /> : 'Create Doctor'}
        </Button>
      </form>
    </Form>
  )
}
