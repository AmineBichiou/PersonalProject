'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransfersTable } from './transfers-table';
import { useState } from 'react';
import { SearchInput } from './search';

export default function ProductsPage({ searchParams }: { searchParams: { q: string; offset: string } }) {
  const search = searchParams.q ?? '';
  const offset = Number(searchParams.offset ?? '0');

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  console.log('Selected date:', selectedDate);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">Archived</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Transfer</span>
          </Button>
        </div>
      </div>

      <TabsContent value="all">
        {/* Center the search input */}
        <div className="flex justify-center my-4"> 
          <SearchInput onDateChange={setSelectedDate} /> {/* Removed value prop */}
        </div>

        <TransfersTable offset={0} totalTransfers={100} selectedDate={selectedDate} />
      </TabsContent>
    </Tabs>
  );
}
