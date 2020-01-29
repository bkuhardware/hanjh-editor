import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import RawEditor from './RawEditor';
import Editor from './Editor';

const App = () => {
	return (
		<BrowserRouter>
			<div>
				<Switch>
					<Route exact path="/">
						<Editor />
					</Route>
					<Route exact path="/raw">
						<RawEditor />
					</Route>
					<Redirect to="/" /> 
				</Switch>
			</div>
		</BrowserRouter>
	)
};

export default App;