'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar } from '../ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useAtomValue } from 'jotai'
import { doctorsAtom } from '@doc/design-system/atoms/doctor/doctor-atoms'
import { Button } from '../ui/button'
import CreateDoctorDialog from './create-doctor-dialog'

export function Doctors() {
  const [searchQuery, setSearchQuery] = useState('')
  const doctors = useAtomValue(doctorsAtom)

  const filteredDoctors = doctors.filter((doctor) => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      doctor.firstName.toLowerCase().includes(searchTerm) ||
      doctor.lastName.toLowerCase().includes(searchTerm) ||
      doctor.email.toLowerCase().includes(searchTerm)
    )
  })

  return (
    <Card className="w-full p-4 border-none">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="font-heading">Doctors</CardTitle>
          <CardDescription>View and manage all doctors</CardDescription>
        </div>
        <CreateDoctorDialog>
          <Button variant="shine">Add Doctor</Button>
        </CreateDoctorDialog>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[600px]">
          <div className="grid gap-4">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="flex items-center p-4 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.username}`}
                  />
                  <AvatarFallback>{`${doctor.firstName[0]}${doctor.lastName[0]}`}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none font-heading">
                    {doctor.firstName} {doctor.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{doctor.username}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default Doctors
