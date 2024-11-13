'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/icons';
import { Search } from 'lucide-react';


export function SearchInput({
  onDateChange,
}: {
  onDateChange: (date: string) => void;
}) {

  // Function to handle date selection

  return (
    <form className="relative ml-auto flex items-center md:grow-0 w-full md:w-auto">
  {/* Center the Search icon inside the input */}
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  
  {/* Input field with padding to make space for the icon */}
  <input
    type="date"
    defaultValue={new Date().toISOString().split('T')[0]} // Set the default value to today's date
    onChange={(e) => onDateChange(e.target.value)}
    className="pl-10 w-full md:w-[200px] lg:w-[336px] rounded-lg bg-background text-sm"
  />
</form>

  );
}