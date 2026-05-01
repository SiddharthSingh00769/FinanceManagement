"use client";

import { updateDefaultAccount, deleteAccount } from '@/actions/accounts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { ArrowDownRight, ArrowUpRight, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { AnimatedCounter } from '@/components/animations/animated-counter';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const AccountCard = ({ account }) => {
    const { name, type, balance, id, isDefault } = account;

    const [showConfirm, setShowConfirm] = useState(false);
    
    // Holographic effect state
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 300 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const shineX = useTransform(springX, [0, 400], ["0%", "100%"]);
    const shineY = useTransform(springY, [0, 200], ["0%", "100%"]);
    const shineOpacity = useTransform(springX, [0, 400], [0, 0.4]);

    const handleMouseMove = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    }, [mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error,
    } = useFetch(updateDefaultAccount);

    const {
        loading: deleteLoading,
        fn: deleteAccountFn,
        data: deleteResult,
        error: deleteError,
    } = useFetch(deleteAccount);

    const handleDefaultChange = async(event) => {
        event.preventDefault();

        if(isDefault){
            toast.warning("You need at least one default account!");
            return; //Don't allow toggling off the default account
        }

        await updateDefaultFn(id);
    }

    const handleDelete = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await deleteAccountFn(id);
    };

    useEffect(() => {
        if(updatedAccount?.success){
            toast.success("Default account updated successfully!");
        }
    }, [updatedAccount, updateDefaultLoading])

    useEffect(() => {
        if(error){
            toast.error(error.message || "Failed to update the default account!");
        }
    }, [error])

    useEffect(() => {
        if (deleteResult?.success) {
            toast.success("Account deleted successfully!");
            setShowConfirm(false);
        }
    }, [deleteResult, deleteLoading]);

    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError.message || "Failed to delete the account!");
        }
    }, [deleteError]);

  return (
    <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ 
            scale: 1.02,
            rotateX: -2,
            rotateY: 2,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full perspective-1000"
    >
        <Card className="glass-card neon-glow-blue hover:shadow-blue-500/10 transition-all group relative h-full border-white/20 overflow-hidden">
        {/* Holographic Shine Overlay */}
        <motion.div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
                background: useTransform(
                    [shineX, shineY],
                    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.3) 0%, transparent 50%)`
                ),
                opacity: shineOpacity,
            }}
        />

        {/* Rainbow Glint Line */}
        <motion.div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
                background: `linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.1) 48%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 52%, transparent 55%)`,
                backgroundSize: "250% 250%",
                x: useTransform(springX, [0, 400], ["-100%", "100%"]),
            }}
        />

        <Link href={`/account/${id}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-20">
                <CardTitle className="text-sm font-semibold capitalize tracking-tight">{name}</CardTitle>
                <Switch checked={isDefault} onClick={handleDefaultChange} disabled={updateDefaultLoading} className="cursor-pointer"/>
            </CardHeader>
            <CardContent className="relative z-20">
                <div className='text-3xl font-extrabold tracking-tight'>
                    <AnimatedCounter targetValue={parseFloat(balance)} />
                </div>
                <p className='text-xs font-medium text-muted-foreground mt-1'>
                    {type.charAt(0) + type.slice(1).toLowerCase()} Account
                </p>
            </CardContent>
            <CardFooter className="flex justify-between text-xs font-semibold text-muted-foreground mt-2 pt-4 border-t border-white/5 relative z-20">
                <div className='flex items-center px-2 py-1 rounded-full bg-green-500/10 text-green-500'>
                    <ArrowUpRight className='mr-1 h-3 w-3'/>
                    Income
                </div>
                <div className='flex items-center px-2 py-1 rounded-full bg-red-500/10 text-red-500'>
                    <ArrowDownRight className='mr-1 h-3 w-3'/>
                    Expense
                </div>
            </CardFooter>
        </Link>

        {/* Delete button — appears on hover */}
        {!showConfirm ? (
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer z-30"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                }}
                title="Delete account"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        ) : (
            <div
                className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-3 z-40 px-4"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <p className="text-sm font-semibold">Delete &quot;{name}&quot;?</p>
                <p className="text-[10px] text-muted-foreground text-center">
                    All transactions will be permanently deleted.
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowConfirm(false);
                        }}
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={handleDelete}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        )}
        </Card>
    </motion.div>
  )
}

export default AccountCard
