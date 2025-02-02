import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import jaLocale from '@fullcalendar/core/locales/ja';

export default function Dashboard() {
	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					家計簿
				</h2>
			}
		>
			<Head title="Dashboard" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
						<div className="mb-5">
							<p className='text-gray-900'>登録</p>
						</div>
						<div>
							<FullCalendar
								plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
								allDaySlot={false}
								locales={[jaLocale]}
								locale='ja'
								firstDay={1}
								headerToolbar={{
									left: 'prev,next today',
									center: 'title',
									right: 'dayGridMonth,timeGridWeek,listWeek',
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
