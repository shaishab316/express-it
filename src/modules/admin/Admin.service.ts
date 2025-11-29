import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import config from '@/config';
import { prisma } from '@/utils/db';
import { hashPassword } from '../auth/Auth.utils';
import { UserServices } from '../user/User.service';

/**
 * Admin services
 */
export const AdminServices = {
  /**
   * Seeds the admin user if it doesn't exist in the database
   *
   * This function checks if an admin user already exists in the database.
   * If an admin user exists, it returns without creating a new one.
   * Otherwise, it prompts for admin credentials and creates a new admin user.
   */
  async seed() {
    const spinner = ora(
      chalk.yellow('Preparing to create admin user...'),
    ).start();

    try {
      spinner.stop();

      // Prompt for admin credentials
      console.log(chalk.cyan('\n📝 Enter admin credentials:\n'));

      const { name } = await inquirer.prompt<{ name: string }>([
        {
          type: 'input',
          name: 'name',
          message: 'Admin name:',
          validate: (input: string) => {
            if (!input.trim()) {
              return 'Name is required';
            }
            return true;
          },
        },
      ]);

      const { email } = await inquirer.prompt<{ email: string }>([
        {
          type: 'input',
          name: 'email',
          message: 'Admin email:',
          validate: (input: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input)) {
              return 'Please enter a valid email address';
            }
            return true;
          },
        },
      ]);

      const { password } = await inquirer.prompt<{ password: string }>([
        {
          type: 'password',
          name: 'password',
          message: 'Admin password:',
          mask: '*',
          validate: (input: string) => {
            if (input.length < 6) {
              return 'Password must be at least 6 characters long';
            }
            return true;
          },
        },
      ]);

      await inquirer.prompt<{ confirmPassword: string }>([
        {
          type: 'password',
          name: 'confirmPassword',
          message: 'Confirm password:',
          mask: '*',
          validate: (input: string) => {
            if (input !== password) {
              return 'Passwords do not match';
            }
            return true;
          },
        },
      ]);

      // Check if user with this email already exists
      const existingUser = await prisma.user.findFirst({ where: { email } });

      const hashedPassword = await hashPassword(password);

      if (existingUser) {
        spinner.warn(chalk.yellow('User with this email already exists!'));

        const { action } = await inquirer.prompt<{ action: string }>([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              { name: 'Make this user an admin', value: 'upgrade' },
              { name: 'Cancel', value: 'cancel' },
            ],
          },
        ]);

        if (action === 'cancel') {
          spinner.info(chalk.blue('Operation cancelled.'));
          return;
        }

        spinner.start(chalk.yellow('⚙ Updating user to admin...'));

        // Update existing user to admin
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name,
            password: hashedPassword,
            is_admin: true,
            is_active: true,
            is_verified: true,
          },
        });
      } else {
        // Create new admin user
        await UserServices.register({
          name,
          email,
          password,
          avatar: config.server.default_avatar,
          is_active: true,
          is_verified: true,
          is_admin: true,
        });
      }

      spinner.succeed(chalk.green('Admin user created successfully!'));
    } catch (error: any) {
      spinner.fail(chalk.red(`Failed to seed admin user: ${error.message}`));
      throw error;
    }
  },
};
