'use client'

import { useState } from 'react'
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
    <section className="w-full p-6 container bg-background rounded-lg shadow-sm h-full flex-grow">
      <header className="flex flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Doctors</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all doctors
          </p>
        </div>
        <CreateDoctorDialog>
          <Button variant="shine">Add Doctor</Button>
        </CreateDoctorDialog>
      </header>

      <div className="flex flex-col gap-4 flex-grow h-full">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="h-full">
          <ul className="grid gap-4">
            {filteredDoctors.map((doctor) => (
              <li
                key={doctor.id}
                className="flex items-center p-4 transition-colors hover:bg-muted/50 border rounded-lg"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.username}`}
                  />
                  <AvatarFallback>{`${doctor.firstName[0]}${doctor.lastName[0]}`}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <h2 className="text-sm font-medium leading-none font-heading">
                    {doctor.firstName} {doctor.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {doctor.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{doctor.username}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </section>
  )
}

export default Doctors
