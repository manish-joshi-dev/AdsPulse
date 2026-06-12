import React from 'react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center rounded-xl border border-rose-200 bg-rose-50">
          <h2 className="text-lg font-semibold text-rose-800">Something went wrong</h2>
          <Button className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
