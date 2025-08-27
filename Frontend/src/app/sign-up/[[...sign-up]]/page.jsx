import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/auth'); // go to the combined page
}
