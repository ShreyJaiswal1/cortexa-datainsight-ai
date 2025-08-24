'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function AnalysisCard({ analysisData }) {
  if (!analysisData) return null;

  const stats = ['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max'];
  const columns = Object.keys(analysisData);

  return (
    <Card className='w-full max-w-lg'>
      <CardHeader>
        <CardTitle>Data Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Statistic</TableHead>
              {columns.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat}>
                <TableCell className='font-medium'>{stat}</TableCell>
                {columns.map((col) => {
                  const value = analysisData[col][stat];
                  return (
                    <TableCell key={`${col}-${stat}`}>
                      {/* This is the corrected part: check if the value is a number */}
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
