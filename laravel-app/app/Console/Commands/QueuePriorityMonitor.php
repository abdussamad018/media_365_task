<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class QueuePriorityMonitor extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'queue:monitor-priority {--live : Monitor queues in real-time}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitor priority-based queue processing status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Priority Queue Monitor');
        $this->info('========================');
        
        if ($this->option('live')) {
            $this->monitorLive();
        } else {
            $this->showCurrentStatus();
        }
    }
    
    private function showCurrentStatus()
    {
        $queues = ['enterprise', 'pro', 'free'];
        
        $this->info("\n📊 Current Queue Status:");
        $this->info('------------------------');
        
        foreach ($queues as $queue) {
            $pendingJobs = DB::table('jobs')->where('queue', $queue)->count();
            $failedJobs = DB::table('failed_jobs')->where('queue', $queue)->count();
            
            $priority = $this->getPriorityLabel($queue);
            $status = $pendingJobs > 0 ? '🟡 Active' : '🟢 Idle';
            
            $this->line(sprintf(
                "%-12s | %-8s | %-8s | %-8s | %s",
                ucfirst($queue),
                $pendingJobs,
                $failedJobs,
                $priority,
                $status
            ));
        }
        
        $this->info("\n💡 To start priority processing, run:");
        $this->comment('php artisan queue:work --queue=enterprise,pro,free');
        
        $this->info("\n📈 Queue Statistics:");
        $this->info('-------------------');
        
        $totalPending = DB::table('jobs')->count();
        $totalFailed = DB::table('failed_jobs')->count();
        
        $this->line("Total Pending Jobs: {$totalPending}");
        $this->line("Total Failed Jobs: {$totalFailed}");
    }
    
    private function monitorLive()
    {
        $this->info("\n🔄 Live Monitoring Started (Press Ctrl+C to stop)");
        $this->info('================================================');
        
        $headers = ['Queue', 'Pending', 'Failed', 'Priority', 'Status'];
        
        while (true) {
            $queues = ['enterprise', 'pro', 'free'];
            $rows = [];
            
            foreach ($queues as $queue) {
                $pendingJobs = DB::table('jobs')->where('queue', $queue)->count();
                $failedJobs = DB::table('failed_jobs')->where('queue', $queue)->count();
                
                $priority = $this->getPriorityLabel($queue);
                $status = $pendingJobs > 0 ? '🟡 Active' : '🟢 Idle';
                
                $rows[] = [
                    ucfirst($queue),
                    $pendingJobs,
                    $failedJobs,
                    $priority,
                    $status
                ];
            }
            
            // Clear screen and redraw
            system('clear');
            $this->info('🚀 Priority Queue Monitor - Live View');
            $this->info('=====================================');
            $this->info('Updated: ' . now()->format('Y-m-d H:i:s'));
            $this->info('');
            
            $this->table($headers, $rows);
            
            $this->info("\n💡 Processing Order: Enterprise → Pro → Free");
            $this->info('Press Ctrl+C to stop monitoring');
            
            sleep(5); // Update every 5 seconds
        }
    }
    
    private function getPriorityLabel(string $queue): string
    {
        return match($queue) {
            'enterprise' => '3x (Highest)',
            'pro' => '2x (Medium)',
            'free' => '1x (Lowest)',
            default => 'Unknown'
        };
    }
}
