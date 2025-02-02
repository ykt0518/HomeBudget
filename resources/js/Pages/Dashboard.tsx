import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import jaLocale from '@fullcalendar/core/locales/ja';
import { useState, useEffect } from 'react';

const fetchHolidays = async (): Promise<{ date: string, name: string }[]> => {
  try {
		// 国民の祝日API
    const response = await fetch("https://holidays-jp.github.io/api/v1/date.json");
    const data = await response.json();

    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 1;
    const endYear = currentYear + 1;

    // 現在の年と前後1年分を取得
    const holidaysForSelectedYears = Object.keys(data).filter(date => {
      const holidayYear = new Date(date).getFullYear();
      return holidayYear >= startYear && holidayYear <= endYear;
    });

    // 祝日名と日付をイベント形式に変換
    return holidaysForSelectedYears.map(date => ({
      date: date,
      name: data[date],
    }));
  } catch (error) {
    console.error("Failed to fetch holidays:", error);
    return [];
  }
};

export default function Dashboard() {
	const [holidays, setHolidays] = useState<{ date: string, name: string }[]>([]);

  useEffect(() => {
    fetchHolidays().then(holidays => {
      setHolidays(holidays);
    });
  }, []);

  // FullCarenderと国民の祝日APIのローカルタイムを一致させる
  const holidayDates = new Set(
    holidays.map(holiday => {
      const date = new Date(holiday.date);
      date.setHours(0, 0, 0, 0);
      return date.toISOString().split("T")[0];
    })
  );
	
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
								// 土日と祝日の色を変える
								dayCellClassNames={(arg) => {
									const dateStr = arg.date.toISOString().split("T")[0];
									if (arg.date.getDay() === 0 || arg.date.getDay() === 6) {
										return "bg-blue-100";
									}
									if (holidayDates.has(dateStr)) {
										return "bg-red-100";
									}
									return "";
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
