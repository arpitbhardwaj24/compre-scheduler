import logo from './logo.svg';
import './App.css';
import Navigation from './Components/Navigation';
import Table from './Components/Table';
import Block from './Components/Block';
import { Box, Button, Container, Grid, makeStyles, Paper } from '@material-ui/core';
import { useState, useEffect, createContext } from 'react';
import axios from 'axios';

export const BlockContext = createContext({
	deleteBlock: null,
	dates: null,
	rows: null,
	setRows: null
});

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
		// cursor: busy?"wait":"default"
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary
	},
	container: {
		height: '100%'
	}
}));

function App() {
	// const classes = useStyles();
	useEffect(() => {
		axios
			.get('https://nameless-sea-65364.herokuapp.com/schedule/5f9aa9dc51c33560c0666e2e/T4')
			.then(function (response) {
				// console.log(response);
				const days = response.data[0].schedule.days;
				// console.log(days);
				let newDates = [];
				const dayIndex = ['MON', 'TUE', 'WED', 'THURS', 'FRI', 'SAT', 'SUN'];
				const newRows = [
					{ name: 'Slot 1', data: [] },
					{ name: 'Slot 2', data: [] },
					{ name: 'Slot 3', data: [] }
				];
				setBlocks(response.data[0].blocks);
				days.forEach((day) => {
					let newDate = new Date(day.date);
					let formattedDate = newDate.getDate() + '/' + newDate.getMonth() + ' ' + dayIndex[newDate.getDay()];

					const dateString = day.date;
					const dateObj = {
						formattedDate: formattedDate,
						dateString: dateString
					};
					newDates = [...newDates, dateObj];
					newRows[0].data = [...newRows[0].data, day.an];
					newRows[1].data = [...newRows[1].data, day.fn];
				});
				console.log(newDates);
				// console.log(newRows);
				setRows(newRows);
				setDates(newDates);
			})
			.catch(function (error) {
				console.log(error);
			});
	}, []);

	const [dates, setDates] = useState([]);
	const [busy, setBusy] = useState(false);
	const [blocks, setBlocks] = useState([
		// {
		//   courses: [
		//     {
		//       name: "BIO F111",
		//       capacity: "920",
		//       slot: "M W F 4",
		//       state: true,
		//     },
		//   ],
		// },
		// {
		//   courses: [
		//     {
		//       name: "BIO F112",
		//       capacity: "920",
		//       slot: "T TH S 4",
		//       state: true,    // console.log(data);
		//     },
		//   ],
		// },
	]);
	const [rows, setRows] = useState([]);

	const saveData = () => {
		const data = {
			updatedBlocks: blocks,
			updatedSchedule: {
				days: []
			}
		};
		rows.forEach((row, slot) => {
			if (slot === 0) {
				row.data.forEach((block, index) => {
					data.updatedSchedule.days[index] = {
						date: dates[index]?.dateString,
						an: block
					};
				});
			}
			if (slot === 1) {
				row.data.forEach((block, index) => {
					data.updatedSchedule.days[index].fn = block;
				});
			}
		});

		console.log(data);
		setBusy(true);
		axios
			.post('https://secret-sea-25561.herokuapp.com/schedule/5f9aa9dc51c33560c0666e2e/T1/update', data)
			.then((res) => {
				setBusy(false);
				console.log(res);
			})
			.catch((err) => console.log(err));
	};

	const addBlock = (course) => {
		let newBlocks;
		blocks.forEach((data, i) => {
			if (data.courses[0]?.slot === course.slot) {
				let modBlocks = blocks.filter((el, index) => {
					return index !== i;
				});
				let modCourses = [...blocks[i].courses, course];
				newBlocks = [...modBlocks, { courses: modCourses }];
				setBlocks(newBlocks);
			} else if (i === blocks.length - 1) {
				setBlocks([...blocks, { courses: [course] }]);
			}
		});
		console.log('New Blocks', blocks);
	};

	const deleteBlock = (name) => {
		blocks.forEach((data, i) => {
			data.courses.forEach((course, j) => {
				if (course.name === name) {
					// let modBlocks = blocks.filter((el, index) => {
					//   return index !== i;
					// });
					let modCourses = blocks[i].courses.filter((el, index) => {
						return index !== j;
					});
					let newBlocks = blocks;
					newBlocks[i] = { courses: modCourses };
					setBlocks(newBlocks);
				}
			});
		});
	};

	// deleteBlock("BIO F111");
	// useEffect(() => {
	//   addBlock({
	//     name: "MATHS F111",
	//     capacity: "920",
	//     slot: "M W F 4",
	//     state: true,
	//   });
	// });

	return (
		<BlockContext.Provider value={{ deleteBlock, dates, rows, setRows }}>
			<div className="App">
				<Navigation saveData={saveData} />
				<Grid container>
					<Grid item xs={2} style={{ overflow: 'auto', height: '92vh' }}>
						{blocks?.map((group) => {
							return group.courses?.length ? (
								<div
									style={{
										border: '1px solid #9FA8DA',
										margin: 10,
										background: '#9FA8DA33',
										paddingBottom: 5
									}}
								>
									<div
										style={{
											background: '#9FA8DA',
											textAlign: 'left',
											padding: 5,
											color: 'white'
										}}
									>
										{group.courses[0].slot}
									</div>
									{group.courses.map((el) => {
										if (el.state) return <Block data={el} row={-1} col={-1} />;
									})}
								</div>
							) : null;
						})}
					</Grid>
					<Grid item xs={10}>
						<Table></Table>
					</Grid>
				</Grid>
			</div>
		</BlockContext.Provider>
	);
}

export default App;
