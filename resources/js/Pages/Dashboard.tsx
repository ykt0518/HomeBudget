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
    const response = await fetch("https://holidays-jp.github.io/api/v1/date.json");
    const data = await response.json();

    const currentYear = new Date().getFullYear();

    // APIから取得した祝日データを現在の年にフィルタリング
    const holidaysForCurrentYear = Object.keys(data).filter(date => {
      const holidayYear = new Date(date).getFullYear();
      return holidayYear === currentYear; // 現在の年と一致する祝日を取得
    });

    // 祝日名と日付をイベント形式に変換
    return holidaysForCurrentYear.map(date => ({
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

  // 祝日の日付をセットに変換（ローカルタイム）
  const holidayDates = new Set(
    holidays.map(holiday => {
      const date = new Date(holiday.date);
      // ローカルタイムでの祝日をUTCの日付と一致させるために、時間を00:00:00に調整
      date.setHours(0, 0, 0, 0);  // ここでローカルタイムに調整
      return date.toISOString().split("T")[0]; // 日付部分を取得
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
