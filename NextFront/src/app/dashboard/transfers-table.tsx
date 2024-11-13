'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Transfer } from '@/lib/graphql';

export function TransfersTable({
  offset,
  totalTransfers,
  selectedDate,
}: {
  offset: number;
  totalTransfers: number;
  selectedDate: string | null;
}) {
  const router = useRouter();
  const transfersPerPage = 5;

  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');


  // Time options in HH:mm format
  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

  // Create minute options in increments of 5
  const minuteOptions = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  function formatDateToISO(dateString: string | null) {
    if (!dateString) return null;

    const date = new Date(dateString);
    const isoString = date.toISOString().split('.')[0] + '.000+00:00';
    return isoString;
  }

  async function fetchTransfers() {
    const client = new GraphQLClient('https://localhost:7142/graphql');
    console.log('Fetching transfers for date:', selectedDate);

    const GET_TRANSFERS = gql`
      {
        transfers(date: "${formatDateToISO(selectedDate)}") {
          edges {
            node {
              id
              from
              to
              dateTime
              isCompleted
              status
              options
              client {
                id
                name
                email
                phone
              }
            }
          }
        }
      }
    `;
    console.log('Query:', GET_TRANSFERS);

    try {
      setLoading(true);
      const data = await client.request<{ transfers: { edges: { node: Transfer }[] } }>(GET_TRANSFERS);
      const fetchedTransfers = data.transfers.edges.map((edge) => edge.node);
      setTransfers(fetchedTransfers);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching transfers.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedDate) {
      fetchTransfers();
    }
  }, [selectedDate]);

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/?offset=${offset}`, { scroll: false });
  }

  // Mutation for updating transfer time
  async function updateTransferTime(transferId: string, newTime: string) {
    const client = new GraphQLClient('https://localhost:7142/graphql');

    console.log('new tiime:', newTime);

    const UPDATE_TRANSFER_TIME = gql`
      mutation {
        updateTransferTime(transferId: "${transferId}", newTime: "${newTime}") {
          id
          dateTime
        }
      }
    `;
    console.log('Update:', UPDATE_TRANSFER_TIME );

    try {
      const response = await client.request(UPDATE_TRANSFER_TIME);
      // Update the local state with the new time
      const updatedTransfer = (response as { updateTransferTime: Transfer }).updateTransferTime;
      setTransfers((prev) =>
        prev.map((transfer) =>
          transfer.id === updatedTransfer.id ? { ...transfer, dateTime: updatedTransfer.dateTime } : transfer
        )
      );
    } catch (err) {
      console.error('Error updating transfer time:', err);
    }
  }

    const handleTimeChange = (transferId: string, selectedHour: string, selectedMinute: string) => {
      const transfer = transfers.find(t => t.id === transferId);
      if (!transfer) return;
    
      const dateTime = new Date(transfer.dateTime);
    
      // Set hours and minutes according to the UTC time
      dateTime.setUTCHours(parseInt(selectedHour, 10)); // Set the new hours in UTC
      dateTime.setUTCMinutes(parseInt(selectedMinute, 10)); // Set the new minutes in UTC
    
      // Now send the updated dateTime in UTC format
      updateTransferTime(transfer.id, dateTime.toISOString());
      console.log('TransferId:', dateTime.toISOString());
      console.log('SelectedHour:', selectedHour);
    };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfers</CardTitle>
        <CardDescription>Manage your transfers and view their status.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell"></TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Time</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer) => {
              const dateTime = new Date(transfer.dateTime);
              const date = dateTime.toDateString(); // Get date
              const hours = dateTime.getUTCHours().toString().padStart(2, '0'); // Get hours
              const minutes = dateTime.getMinutes().toString().padStart(2, '0'); // Get minutes

              return (
                <TableRow key={transfer.id}>
                  <TableHead className="hidden w-[100px] sm:table-cell">{transfer.client.name}</TableHead>
                  <TableHead>{transfer.from}</TableHead>
                  <TableHead>{transfer.to}</TableHead>
                  <TableHead>{transfer.isCompleted ? 'Completed' : 'Pending'}</TableHead>
                  <TableHead className="hidden md:table-cell">{date}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex space-x-2">
                      <select 
                        value={hours} 
                        onChange={(e) => handleTimeChange(transfer.id, e.target.value, minutes)}
                        className="border rounded p-1"
                      >
                        {hourOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <select 
                        value={minutes} 
                        onChange={(e) => handleTimeChange(transfer.id, hours, e.target.value)}
                        className="border rounded p-1"
                      >
                        {minuteOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{Math.min(offset - transfersPerPage, totalTransfers) + 1}-{offset}</strong> of{' '}
            <strong>{totalTransfers}</strong> transfers
          </div>
          <div className="flex">
            <Button onClick={prevPage} variant="ghost" size="sm" disabled={offset === transfersPerPage}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button onClick={nextPage} variant="ghost" size="sm" disabled={offset + transfersPerPage > totalTransfers}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
