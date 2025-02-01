'use client'

import { useState } from 'react'
import { Doctor } from '@doc/database/schema/doctors'
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

interface DoctorsProps {
  doctors: Doctor[]
}

export function Doctors({ doctors }: DoctorsProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDoctors = doctors.filter((doctor) => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      doctor.firstName.toLowerCase().includes(searchTerm) ||
      doctor.lastName.toLowerCase().includes(searchTerm) ||
      doctor.email.toLowerCase().includes(searchTerm)
    )
  })

  return (
    <Card className="w-full p-4">
      <CardHeader>
        <CardTitle className="font-heading">Doctors</CardTitle>
        <CardDescription>View and manage all doctors</CardDescription>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
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
